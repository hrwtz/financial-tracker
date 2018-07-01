import { Injectable } from '@angular/core';
import forOwn from 'lodash/forOwn';

import { Category, Categories } from './models/category.model';
import { LocalStorageService } from './local-storage.service';

interface Hash {
	[key: string]: string
};

@Injectable()
export class CategoryHashService {
	private hashes: {
		parent: Hash,
		type: Hash
	};
	private hasGenerated = false;

	constructor(
		private localStorageService: LocalStorageService
	) {}

	getHash(hashName: string, forceGenerate?: boolean): Hash {
		if (!this.hasGenerated || forceGenerate) {
			this.generateHashes();
		}

		if (!['parent', 'type'].includes(hashName)) {
			throw new Error('Category hash name must be either parent or type.');
		}

		return this.hashes[hashName];
	}

	/*
	 * Creates two hashes. Both hashes have a key for each of the child categories
	 * The values in the parent hash are the child category's parent category. If
	 * the category does not have a parent category, it's value is it's own category
	 * name. The type hash sets the category's type (expense/income/etc) as the
	 * values in the hash.
	 */
	private generateHashes(): void {
		const categories: Categories = this.localStorageService.get('categories');

		this.hashes = {
			parent: {},
			type: {}
		};

		forOwn(categories, (cats: Category[], type: string) => {
			cats.forEach((cat: Category) => {
				this.hashes.parent[cat.name] = cat.name;
				this.hashes.type[cat.name] = type;
				cat.children.forEach((child: Category) => {
					this.hashes.parent[child.name] = cat.name;
					this.hashes.type[child.name] = type;
				});
			});
		});

		this.hasGenerated = true;
	}
}
