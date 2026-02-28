import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const user = await getAuthUser(request);
    if (!user || user.role !== 'NGO') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { projectId, sourcePipelineId, templateId, name } = await request.json();

    if (!projectId || (!sourcePipelineId && !templateId)) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    let tasksToClone = [];
    let pipelineName = name || 'Cloned Pipeline';

    if (sourcePipelineId) {
      const source = await prisma.pipeline.findUnique({
        where: { id: sourcePipelineId },
        include: { tasks: true }
      });

      if (!source) {
        return NextResponse.json({ message: 'Source pipeline not found' }, { status: 404 });
      }

      pipelineName = name || `${source.name} (Clone)`;
      tasksToClone = source.tasks;
    }

    if (templateId) {
      const template = await prisma.template.findUnique({
        where: { id: templateId },
        include: { tasks: true }
      });

      if (!template) {
        return NextResponse.json({ message: 'Template not found' }, { status: 404 });
      }

      pipelineName = name || `${template.name} (Template)`;
      tasksToClone = template.tasks;
    }

    const pipeline = await prisma.pipeline.create({
      data: {
        name: pipelineName,
        projectId,
        tasks: {
          create: tasksToClone.map((task) => ({
            title: task.title,
            description: task.description,
            status: 'open',
            tags: task.tags || []
          }))
        }
      },
      include: { tasks: true }
    });

    return NextResponse.json({ pipeline }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to clone pipeline', error: error.message }, { status: 500 });
  }
}
