import { and, eq } from 'drizzle-orm';
import { aiAppliedCourse } from '../server/academy-course-content';
import { academyAssessments, academyCourses, academyLessons, academyModules } from '../shared/schema';
import { db, pool } from '../server/db';

async function seedAcademyCourse() {
  if (!db) throw new Error('DATABASE_URL requerida para cargar el contenido de Academia.');

  await db.transaction(async (tx) => {
    const [course] = await tx.select().from(academyCourses).where(eq(academyCourses.slug, aiAppliedCourse.slug)).limit(1);
    if (!course) throw new Error(`No se encontró ${aiAppliedCourse.slug}; ejecuta primero db:migrate.`);

    if (course.status === 'coming_soon') {
      await tx.update(academyCourses).set({
        title: aiAppliedCourse.title,
        description: aiAppliedCourse.description,
        category: aiAppliedCourse.category,
        level: aiAppliedCourse.level,
        estimatedMinutes: aiAppliedCourse.estimatedMinutes,
        modality: 'self_paced',
        status: 'preview',
        updatedAt: new Date(),
      }).where(eq(academyCourses.id, course.id));
    }

    for (let moduleIndex = 0; moduleIndex < aiAppliedCourse.modules.length; moduleIndex += 1) {
      const moduleData = aiAppliedCourse.modules[moduleIndex];
      const position = moduleIndex + 1;
      const [existingModule] = await tx.select().from(academyModules).where(and(
        eq(academyModules.courseId, course.id),
        eq(academyModules.position, position),
      )).limit(1);
      const [module] = existingModule ? [existingModule] : await tx.insert(academyModules).values({
            courseId: course.id,
            title: moduleData.title,
            description: moduleData.description,
            position,
            isRequired: moduleData.isRequired,
            published: true,
          }).returning();

      for (let lessonIndex = 0; lessonIndex < moduleData.lessons.length; lessonIndex += 1) {
        const lessonData = moduleData.lessons[lessonIndex];
        const lessonPosition = lessonIndex + 1;
        const [existingLesson] = await tx.select().from(academyLessons).where(and(
          eq(academyLessons.moduleId, module.id),
          eq(academyLessons.position, lessonPosition),
        )).limit(1);
        const lessonValues = {
          title: lessonData.title,
          description: lessonData.description,
          content: lessonData.content,
          position: lessonPosition,
          isFreePreview: lessonData.isFreePreview,
          published: true,
        };
        if (!existingLesson) {
          await tx.insert(academyLessons).values({ moduleId: module.id, ...lessonValues });
        }
      }

      if (moduleData.assessment) {
        const [existingAssessment] = await tx.select().from(academyAssessments).where(and(
          eq(academyAssessments.moduleId, module.id),
          eq(academyAssessments.title, moduleData.assessment.title),
        )).limit(1);
        const assessmentValues = {
          questions: moduleData.assessment.questions,
          passingPercent: moduleData.assessment.passingPercent,
          published: true,
        };
        if (!existingAssessment) {
          await tx.insert(academyAssessments).values({ moduleId: module.id, title: moduleData.assessment.title, ...assessmentValues });
        }
      }
    }
  });

  console.log(`Contenido de ${aiAppliedCourse.slug} cargado en Supabase.`);
}

seedAcademyCourse()
  .catch((error) => {
    console.error('No se pudo cargar el contenido de Academia:', error instanceof Error ? error.message : 'Error desconocido');
    process.exitCode = 1;
  })
  .finally(async () => { await pool?.end(); });
