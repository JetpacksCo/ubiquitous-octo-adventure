import { expect, type Locator, type Page } from '@playwright/test';
import { step } from './step';

export class FilterSteps {
  public constructor(private page: Page) {}

  private filterLink(name: 'All' | 'Active' | 'Completed'): Locator {
    return this.page.getByRole('link', { name, exact: true });
  }

  @step()
  public async showAll() {
    await this.filterLink('All').click();
    await expect(this.page).toHaveURL(/#\/$/);
    await expect(this.filterLink('All')).toHaveClass(/selected/);
  }

  @step()
  public async showActive() {
    await this.filterLink('Active').click();
    await expect(this.page).toHaveURL(/#\/active$/);
    await expect(this.filterLink('Active')).toHaveClass(/selected/);
  }

  @step()
  public async showCompleted() {
    await this.filterLink('Completed').click();
    await expect(this.page).toHaveURL(/#\/completed$/);
    await expect(this.filterLink('Completed')).toHaveClass(/selected/);
  }

  @step((args) => `Only these todos are visible: ${args[0].titles.join(', ')}`)
  public async verifyVisibleTodos({ titles }: { titles: readonly string[] }) {
    await expect(this.page.getByTestId('todo-title')).toHaveText([...titles]);
  }

  @step((args) => `${args[0].count} item(s) left`)
  public async verifyItemsLeft({ count }: { count: number }) {
    const label = count === 1 ? 'item' : 'items';
    await expect(this.page.getByTestId('todo-count')).toHaveText(`${count} ${label} left`);
  }
}
