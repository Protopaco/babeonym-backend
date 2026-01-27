import leoProfanity from 'leo-profanity';
import { Filter } from 'bad-words';

const filter = new Filter();

export default (word: string) => {
  const dirtyWord = leoProfanity.check(word);
  const badWord = filter.isProfane(word);
  return dirtyWord || badWord;
};
