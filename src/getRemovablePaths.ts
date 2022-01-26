// eslint-disable-next-line no-restricted-imports
import get from 'lodash/get';

export function getRemovablePaths(params: {
  data: any;
  paths: Array<string>;

  prevPath?: string;
  levelIndex?: number;
  pathByArray?: Array<string>;
  pathsOptimized?: Array<string>;
}): Array<string> {
  let { data, prevPath = '', paths, levelIndex = 0, pathByArray, pathsOptimized = [] } = params;

  paths.forEach((child, index) => {
    let path = '';
    const isZeroLevel = levelIndex === 0;

    if (isZeroLevel) {
      pathByArray = child.split(/\[[0-9]+]\./);
      path = pathByArray[levelIndex];
    } else {
      path = `${prevPath}[${index}].${pathByArray![levelIndex]}`;
    }

    if (!pathByArray![levelIndex + 1]) {
      if (typeof get(data, path) === 'undefined') return;

      // eslint-disable-next-line consistent-return
      return pathsOptimized.push(path);
    }

    const arr = get(isZeroLevel ? data : child, pathByArray![levelIndex]) as Array<string>;

    // eslint-disable-next-line consistent-return
    return getRemovablePaths({
      data,
      prevPath: path,
      paths: arr,
      levelIndex: levelIndex + 1,
      pathByArray,
      pathsOptimized,
    });
  });

  return pathsOptimized;
}
