import { expect, test } from '@playwright/test';
import { TODO_ITEMS } from '../fixtures/constants';

test.describe('Todo list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
    const newTodo = page.getByPlaceholder('What needs to be done?');
    for (const item of TODO_ITEMS) {
      await newTodo.fill(item);
      await newTodo.press('Enter');
    }
  });

  test('mark a todo as complete', async ({ page }) => {
    const firstTodo = page.getByTestId('todo-item').filter({ hasText: TODO_ITEMS[0] });
    await firstTodo.getByRole('checkbox', { name: 'Toggle Todo' }).check();

    await expect(firstTodo.getByRole('checkbox', { name: 'Toggle Todo' })).toBeChecked();
    await expect(page.getByTestId('todo-count')).toHaveText('2 items left');
  });

  test('delete a todo', async ({ page }) => {
    const secondTodo = page.getByTestId('todo-item').filter({ hasText: TODO_ITEMS[1] });
    await secondTodo.hover();
    await secondTodo.getByRole('button', { name: 'Delete' }).click();

    await expect(secondTodo).toHaveCount(0);
    await expect(page.getByTestId('todo-item')).toHaveCount(2);
  });
});
