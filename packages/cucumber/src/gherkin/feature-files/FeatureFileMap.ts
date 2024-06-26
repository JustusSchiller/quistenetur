import { Constructable, Constructor } from '../constructables';
import { ItemNotFoundError } from './errors';

export class FeatureFileMap {

    constructor(private readonly map: { [line: number]: Constructable<any> } = {}) {
    }

    set<T>(item: Constructable<T>) {
        return ({
            onLine: (line: number): FeatureFileMap => {
                this.map[line] = item;

                return this;
            },
        });
    }

    get<T>(type: Constructor<T>) {
        return ({
            onLine: (line: number): T => {
                const found = this.map[line];

                if (! found) {
                    throw new ItemNotFoundError(`Nothing was found on line ${ line }`);
                }

                if (! (found instanceof type))  {
                    throw new ItemNotFoundError(`Item on line ${ line } is a ${ found.constructor.name }, not a ${ type.name }`);
                }

                return found as T;
            },
        });
    }

    getFirst<T>(type: Constructor<T>): T {
        const
            items = Object.keys(this.map).map(line => this.map[line]),
            found = items.find(value => value instanceof type);

        if (! found) {
            const existingTypes = items.map(item => item.constructor.name).join(', ') || 'no items.';

            throw new ItemNotFoundError(`Didn't find any ${ type.name } amongst ${ existingTypes }`);
        }

        return found;
    }

    size() {
        return Object.keys(this.map).length;
    }
}
