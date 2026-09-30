import { test } from '@playwright/test';
import { TODO_ITEMS } from '../fixtures/constants';
import { FilterSteps } from '../helpers/filter-steps';
import { TodoEntrySteps } from '../helpers/todo-entry-steps';
import { TodoListSteps } from '../helpers/todo-list-steps';

test.describe('Filtering todos', () => {
  test.beforeEach(async ({ page }) => {
    await new TodoEntrySteps(page).open();
    await new TodoEntrySteps(page).addTodos({ titles: TODO_ITEMS });
    await new TodoListSteps(page).completeTodo({ title: TODO_ITEMS[1] });
  });

  test('Active shows only open todos', async ({ page }) => {
    const filters = new FilterSteps(page);
    await filters.showActive();
    await filters.verifyVisibleTodos({ titles: [TODO_ITEMS[0], TODO_ITEMS[2]] });
  });

  test('Completed shows only done todos', async ({ page }) => {
    const filters = new FilterSteps(page);
    await filters.showCompleted();
    await filters.verifyVisibleTodos({ titles: [TODO_ITEMS[1]] });
  });

  test('clear completed removes done todos', async ({ page }) => {
    const filters = new FilterSteps(page);
    await test.step('Clear completed and check what is left', async () => {
      await new TodoListSteps(page).clearCompleted();
      await filters.showAll();
      await filters.verifyVisibleTodos({ titles: [TODO_ITEMS[0], TODO_ITEMS[2]] });
      await filters.verifyItemsLeft({ count: 2 });
    });
  });
});
