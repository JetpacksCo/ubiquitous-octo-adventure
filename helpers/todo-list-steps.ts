import { expect, type Locator, type Page } from '@playwright/test';
import { step } from './step';

export class TodoListSteps {
  public constructor(private page: Page) {}

  private todoItem(title: string): Locator {
    return this.page.getByTestId('todo-item').filter({ hasText: title });
  }

  private toggleOf(title: string): Locator {
    return this.todoItem(title).getByRole('checkbox', { name: 'Toggle Todo' });
  }

  private get clearCompletedButton() {
    return this.page.getByRole('button', { name: 'Clear completed' });
  }

  @step((args) => `Complete todo: ${args[0].title}`)
  public async completeTodo({ title }: { title: string }) {
    await this.toggleOf(title).check();
    await expect(this.toggleOf(title)).toBeChecked();
  }

  @step()
  public async uncompleteTodo({ title }: { title: string }) {
    await this.toggleOf(title).uncheck();
    await expect(this.toggleOf(title)).not.toBeChecked();
  }

  @step('Mark all todos as complete')
  public async toggleAll() {
    await this.page.getByLabel('Mark all as complete').check();
    await expect(
      this.page.getByRole('checkbox', { name: 'Toggle Todo', checked: false }),
    ).toHaveCount(0);
  }

  @step((args) => `Delete todo: ${args[0].title}`)
  public async deleteTodo({ title }: { title: string }) {
    const item = this.todoItem(title);
    await item.hover();
    await item.getByRole('button', { name: 'Delete' }).click();
    await expect(item).toHaveCount(0);
  }

  @step()
  public async clearCompleted() {
    await this.clearCompletedButton.click();
    await expect(
      this.page.getByRole('checkbox', { name: 'Toggle Todo', checked: true }),
    ).toHaveCount(0);
    await expect(this.clearCompletedButton).toBeHidden();
  }
}
