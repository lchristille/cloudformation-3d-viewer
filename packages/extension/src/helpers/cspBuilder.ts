enum CspDirective {
    DefaultSrc = 'default-src',
    ImgSrc = 'img-src',
    StyleSrc = 'style-src',
    ScriptSrc = 'script-src',
    ConnectSrc = 'connect-src',
    FontSrc = 'font-src',
    WorkerSrc = 'worker-src'
}

class CspBuilder {
    private directives: { [key: string]: string[]} = {};
    private isDevelopment: boolean;

    constructor(isDevelopment: boolean) {
        this.isDevelopment = isDevelopment;

        this.directives[CspDirective.DefaultSrc] = ["'none'"];
    }

    public addSource(directive: CspDirective, source: string, isDevOnly: boolean = false) {
        if (!this.directives[directive]) {
            this.directives[directive] = [];
        }

        if (!isDevOnly || this.isDevelopment) {
            this.directives[directive].push(source);
        }

        return this;
    }

    public build(): string {
        return Object.entries(this.directives)
        .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
        .join('; ');
    }
}

export {CspBuilder, CspDirective}