import { Answerable, AnswersQuestions, Question, Transform, UsesAbilities } from '@serenity-js/core';
import { IWebDriverOptionsCookie } from 'selenium-webdriver';
import { BrowseTheWeb } from '../abilities';

export class Cookie {
    static valueOf(cookieName: Answerable<string>): Question<Promise<string>> {
        return Transform.the(new CookieDetails(cookieName), details => details && details.value)
            .as(`the value of the "${ cookieName }" cookie`);
    }

    static pathOf(cookieName: Answerable<string>): Question<Promise<string>> {
        return Transform.the(new CookieDetails(cookieName), details => details && details.path)
            .as(`the path of the "${ cookieName }" cookie`);
    }

    static domainOf(cookieName: string) {
        return Transform.the(new CookieDetails(cookieName), details => details && details.domain)
            .as(`the domain of the "${ cookieName }" cookie`);
    }

    static isHTTPOnly(cookieName: string) {
        return Transform.the(new CookieDetails(cookieName), details => details && !! details.httpOnly)
            .as(`the HTTP-only status of the "${ cookieName }" cookie`);
    }

    static isSecure(cookieName: string) {
        return Transform.the(new CookieDetails(cookieName), details => details && !! details.secure)
            .as(`the "secure" status of the "${ cookieName }" cookie`);
    }

    static expiryDateOf(cookieName: string) {
        return Transform.the(new CookieDetails(cookieName), details => {
                // expiry date coming from webdriver is expressed in seconds
                return details && details.expiry && new Date(Number(details.expiry) * 1000);
            })
            .as(`the expiry date of the "${ cookieName }" cookie`);
    }
}

/**
 * @package
 */
class CookieDetails implements Question<Promise<IWebDriverOptionsCookie>> {
    constructor(private readonly name: Answerable<string>) {
    }

    answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<IWebDriverOptionsCookie> {
        return actor.answer(this.name)
            .then(name => BrowseTheWeb.as(actor).manage().getCookie(name))
            .then(details => !! details ? details : undefined);
    }

    toString() {
        return `the details of the "${ this.name } cookie`;
    }
}
