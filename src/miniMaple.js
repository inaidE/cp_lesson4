class Term {
    constructor(coef, sym, exp) {
        this.coef = coef;
        this.sym = sym;
        this.exp = exp;
    }

    diff(variable) {
        if (!this.sym || this.sym !== variable || this.exp === 0) {
            return new Term(0, null, 0);
        }
        const newCoef = this.coef * this.exp;
        const newExp = this.exp - 1;
        return new Term(newCoef, this.sym, newExp);
    }

    toString() {
        if (this.coef === 0) return '';
        if (this.exp === 0 || !this.sym) return `${this.coef}`;

        let str = '';
        if (this.coef === -1) str += '-';
        else if (this.coef !== 1) str += `${this.coef}*`;
        else if (this.coef === 1 && this.exp === 1) str += '';

        str += this.sym;

        if (this.exp > 1) {
            str += `^${this.exp}`;
        }
        return str;
    }
}

class MiniMaple {
    diff(expression, variable) {
        // 1. Проверка на наличие запятой (передана ли переменная)
        if (variable === undefined || variable === null) {
            throw new Error('Неверный формат! Ожидается выражение вида: "полином, переменная"');
        }

        if (/[^a-zA-Z]/.test(variable)) {
            throw new Error('Целевая переменная должна содержать только буквы');
        }

        if (/[^a-zA-Z0-9\+\-\*\^\s]/.test(expression)) {
            throw new Error('Неверный ввод! Обнаружены недопустимые символы');
        }

        const termsStr = expression.replace(/\s+/g, '').match(/[+-]?[^+-]+/g);
        if (!termsStr) return '0';

        const terms = termsStr.map(str => {
            let sign = str.startsWith('-') ? -1 : 1;
            if (str.startsWith('+') || str.startsWith('-')) str = str.slice(1);

            if (!/[a-zA-Z]/.test(str)) {
                return new Term(sign * Number(str), null, 0);
            }

            const starParts = str.split('*');

            if (starParts.length === 2 && /[a-zA-Z]/.test(starParts[0]) && /[a-zA-Z]/.test(starParts[1])) {
                throw new Error('Слагаемое не приведено к каноническому виду (дублирование переменной)');
            }

            if (starParts.length > 2) {
                throw new Error('Обнаружены смешанные переменные или неверный формат степени');
            }

            let coef = 1;
            let sym = str;
            let exp = 1;

            if (str.includes('*')) {
                const parts = str.split('*');
                if (parts[0] === '' || parts[1] === '') {
                    throw new Error('Обнаружены смешанные переменные или неверный формат степени');
                }

                if (/[a-zA-Z]/.test(parts[0])) {
                    sym = parts[0];
                    coef = Number(parts[1]);
                } else {
                    coef = Number(parts[0]);
                    sym = parts[1];
                }
            }

            if (sym.includes('^')) {
                const parts = sym.split('^');
                if (parts[0] === '' || parts[1] === '') {
                    throw new Error('Обнаружены смешанные переменные или неверный формат степени');
                }
                sym = parts[0];
                exp = Number(parts[1]);
            }

            if (Number.isNaN(coef) || Number.isNaN(exp)) {
                throw new Error('Обнаружены смешанные переменные или неверный формат степени');
            }

            return new Term(sign * coef, sym, exp);
        });

        let resultTerms = terms
            .map(t => t.diff(variable))
            .filter(t => t.coef !== 0)
            .map((t, index) => {
                let s = t.toString();
                if (index > 0 && t.coef > 0) return '+' + s;
                return s;
            });

        return resultTerms.length > 0 ? resultTerms.join('') : '0';
    }
}

export { MiniMaple, Term };