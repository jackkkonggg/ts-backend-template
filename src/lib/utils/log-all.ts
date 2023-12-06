import util from 'util';

export function logAll(object: any) {
  console.log(util.inspect(object, { showHidden: false, depth: null, colors: true }));
}
