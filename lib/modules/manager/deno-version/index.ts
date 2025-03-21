import type { Category } from '../../../constants';
import { NpmDatasource } from '../../datasource/npm';
import { id, isValid } from '../../versioning/npm';

import type { PackageDependency, PackageFileContent } from '../types';

export const categories: Category[] = ['js'];

export const defaultConfig = {
  fileMatch: ['(^|/)\\.dvmrc$'],
  versioning: id,
};

export const supportedDatasources = [NpmDatasource.id];

export function extractPackageFile(content: string): PackageFileContent | null {
  if (!content) {
    return null;
  }

  if (content.split('\n').length > 2) {
    return null;
  }

  const dep: PackageDependency & { currentValue: typeof content } = {
    depName: 'Deno',
    packageName: 'deno',
    currentValue: content.trim(),
    datasource: NpmDatasource.id,
  };

  if (!isValid(dep.currentValue)) {
    dep.skipReason = 'invalid-version';
  }
  return { deps: [dep] };
}
