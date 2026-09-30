import { expect, type Page } from '@playwright/test';
import { step } from './step';

export class TodoEntrySteps {
  public constructor(private page: Page) {}

  private get newTodoInput() {
    return this.page.getByPlaceholder('What needs to be done?');
  }

  private get todoTitles() {
    return this.page.getByTestId('todo-title');
  }

  private todoTitle(title: string) {
    return this.todoTitles.filter({ hasText: title });
  }

  private async startEditing(title: string) {
    await this.todoTitle(title).dblclick();
    return this.page.getByRole('textbox', { name: 'Edit' });
  }

  @step('Open the todo app')
  public async open() {
    await this.page.goto('./');
    await expect(this.newTodoInput).toBeVisible();
  }

  @step((args) => `Add todo: ${args[0].title}`)
  public async addTodo({ title }: { title: string }) {
    await this.newTodoInput.fill(title);
    await this.newTodoInput.press('Enter');
    await expect(this.todoTitles.last()).toHaveText(title);
    await expect(this.newTodoInput).toHaveValue('');
  }

  @step((args) => `Add ${args[0].titles.length} todos`)
  public async addTodos({ titles }: { titles: readonly string[] }) {
    for (const title of titles) {
      await this.addTodo({ title });
    }
    await expect
      .poll(async () => (await this.todoTitles.allTextContents()).slice(-titles.length))
      .toEqual([...titles]);
  }

  @step()
  public async editTodo({ from, to }: { from: string; to: string }) {
    const editBox = await this.startEditing(from);
    await editBox.fill(to);
    await editBox.press('Enter');
    await expect(this.todoTitle(to)).toBeVisible();
    await expect(this.todoTitle(from)).toHaveCount(0);
  }

  @step('Start editing a todo and discard the changes')
  public async cancelEdit({ title, draft }: { title: string; draft: string }) {
    const editBox = await this.startEditing(title);
    await editBox.fill(draft);
    await editBox.press('Escape');
    await expect(this.todoTitle(title)).toBeVisible();
    await expect(this.todoTitle(draft)).toHaveCount(0);
  }
}
