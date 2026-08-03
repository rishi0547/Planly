'use server';

import { createActionClient } from '@/utils/supabase/actions';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createTask(formData: FormData) {
  const supabase = await createActionClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const title = String(formData.get('title') || '').trim();
  const content = String(formData.get('content') || '').trim();

  if (!title) {
    throw new Error('Task must have a title');
  }

  const { error } = await supabase
    .from('notes')
    .insert([{ user_id: user.id, title, content, is_completed: false }]);

  if (error) {
    throw error;
  }

  revalidatePath('/dashboard');
}

export async function toggleTaskCompletion(formData: FormData) {
  const supabase = await createActionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const id = String(formData.get('id') || '');
  const isCompleted = formData.get('is_completed') === 'true';

  if (!id) return;

  await supabase
    .from('notes')
    .update({ is_completed: !isCompleted })
    .eq('id', id)
    .eq('user_id', user.id);

  revalidatePath('/dashboard');
}

export async function updateTask(formData: FormData) {
  const supabase = await createActionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const id = String(formData.get('id') || '');
  const title = String(formData.get('title') || '');
  const content = String(formData.get('content') || '');

  if (!id || !title) redirect(`/notes/${id}`);

  await supabase
    .from('notes')
    .update({ title, content })
    .eq('id', id)
    .eq('user_id', user.id);

  revalidatePath('/dashboard');
  revalidatePath(`/notes/${id}`);
}

export async function deleteTask(formData: FormData) {
  const supabase = await createActionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const id = String(formData.get('id') || '');
  if (!id) redirect('/dashboard');

  await supabase
    .from('notes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

// Backward compatibility exports for existing routes
export const createNote = createTask;
export const updateNote = updateTask;
export const deleteNote = deleteTask;
export const summarizeNote = updateTask;
