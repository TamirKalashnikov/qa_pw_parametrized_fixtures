import { test } from '../../_fixtures/fixtures';
import { HomePage } from '../../../src/ui/pages/HomePage';
import { ProfilePage } from '../../../src/ui/pages/ProfilePage';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { generateNewArticleData } from '../../../src/common/testData/generateNewArticleData';

test.use({ contextsNumber: 3, usersNumber: 3 });

test.beforeEach(async ({ pages, users, logger }) => {
  await signUpUser(pages[0], users[0], 1);
  await signUpUser(pages[1], users[1], 2);
  await signUpUser(pages[2], users[2], 3);

  const article1 = generateNewArticleData(logger);
  const article2 = generateNewArticleData(logger);

  await createArticle(pages[0], article1, 1);
  await createArticle(pages[1], article2, 2);

  users[0].article = article1;
  users[1].article = article2;
});

test('User can see in your feeds articles from two different users', async ({
  pages,
  users,
}) => {
  const profilePage = new ProfilePage(pages[2], 3);

  await profilePage.open(users[0].username);
  await profilePage.clickFollowButton();
  await profilePage.assertFollowButtonHasText('Unfollow');

  await profilePage.open(users[1].username);
  await profilePage.clickFollowButton();
  await profilePage.assertFollowButtonHasText('Unfollow');

  const homePage = new HomePage(pages[2], 3);

  await homePage.open();
  await homePage.clickYourFeedTab();
  await homePage.assertArticleIsVisibleInFeed(users[0].article.title);
  await homePage.assertArticleIsVisibleInFeed(users[1].article.title);
});