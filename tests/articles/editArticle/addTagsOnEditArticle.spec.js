/* eslint-disable max-len */
import { test } from '../../_fixtures/fixtures';
import { generateNewArticleData } from '../../../src/common/testData/generateNewArticleData';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';

const testParameters = [
  { tagsNumber: 1, testNameEnding: 'one tag' },
  { tagsNumber: 2, testNameEnding: 'two tags' },
  { tagsNumber: 5, testNameEnding: 'five tags' },
];

testParameters.forEach(({ tagsNumber, testNameEnding }) => {
  test.describe('Add tags on edit to article', () => {
    test.beforeEach(async ({ page, user }) => {
      await signUpUser(page, user);
    });

    test(`User is able to add ${testNameEnding} on edit to the article`, async ({
      homePage,
      createArticlePage,
      viewArticlePage,
      editArticlePage,
      articleWithoutTags,
      logger,
    }) => {
      await homePage.clickNewArticleLink();
      await createArticlePage.submitCreateArticleForm(articleWithoutTags);

      // eslint-disable-next-line max-len
      await viewArticlePage.assertArticleTitleIsVisible(articleWithoutTags.title);

      const newTags = generateNewArticleData(logger, tagsNumber).tags;

      await viewArticlePage.clickEditArticleLink();
      await editArticlePage.fillTagsField(newTags);
      await editArticlePage.clickPublishButton();

      await viewArticlePage.assertArticleTitleIsVisible(articleWithoutTags.title);
      await viewArticlePage.assertArticleTagsAreVisible(newTags);
    });
  });
});