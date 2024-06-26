import { AnswersQuestions } from '@serenity-js/core';
import { formatted } from '@serenity-js/core/lib/io';

import { Expectation } from '../Expectation';
import { ExpectationMet, ExpectationNotMet, Outcome } from '../outcomes';

export function property<Actual, Property extends keyof Actual>(
    propertyName: Property,
    expectation: Expectation<any, Actual[Property]>,
): Expectation<Actual[Property], Actual> {
    return new HasProperty(propertyName, expectation);
}

/**
 * @package
 */
class HasProperty<Property extends keyof Actual, Actual> extends Expectation<Actual[Property], Actual> {
    constructor(
        private readonly propertyName: Property,
        private readonly expectation: Expectation<any, Actual[Property]>,
    ) {
        super();
    }

    answeredBy(actor: AnswersQuestions): (actual: Actual) => Promise<Outcome<any, Actual>> {

        return (actual: Actual) =>
            this.expectation.answeredBy(actor)(actual[this.propertyName])
                .then((outcome: Outcome<any, Actual[Property]>) => {

                    return outcome instanceof ExpectationMet
                        ? new ExpectationMet(this.toString(), outcome.expected, actual)
                        : new ExpectationNotMet(this.toString(), outcome.expected, actual);
                });
    }

    toString(): string {
        return formatted `have property ${ this.propertyName } that does ${ this.expectation }`;
    }
}
