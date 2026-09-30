import { test } from '@playwright/test';
import { TODO_ITEMS } from '../fixtures/constants';
import { FilterSteps } from '../helpers/filter-steps';
import { TodoEntrySteps } from '../helpers/todo-entry-steps';

test.describe('Adding and editing todos', () => {
  test.beforeEach(async ({ page }) => {
    await new TodoEntrySteps(page).open();
  });

  test('user can add a todo', { tag: '@smoke' }, async ({ page }) => {
    await new TodoEntrySteps(page).addTodo({ title: TODO_ITEMS[0] });
    await new FilterSteps(page).verifyItemsLeft({ count: 1 });
  });

  test('user can add several todos', async ({ page }) => {
    await new TodoEntrySteps(page).addTodos({ titles: TODO_ITEMS });
    await new FilterSteps(page).verifyItemsLeft({ count: 3 });
  });

  test('user can rename a todo', async ({ page }) => {
    const entry = new TodoEntrySteps(page);
    await entry.addTodos({ titles: TODO_ITEMS });
    await entry.editTodo({ from: TODO_ITEMS[1], to: 'feed the dog' });
  });

  test('user can discard an edit with Escape', async ({ page }) => {
    const entry = new TodoEntrySteps(page);
    await entry.addTodo({ title: TODO_ITEMS[0] });
    await entry.cancelEdit({ title: TODO_ITEMS[0], draft: 'something else' });
  });
});
