class TransformBasic {
    constructor() {
        this.header = /<\?.*\?>/;
        this.formatting = /(\r?\n|\r)+\s*/g;
        this.comments = /<!.*-->/g;
        this.verboseTags = /<(title|desc)>.*<\/\1>/g;
        this.idContent = /\sid=.*?\s/g;
        this.responsive = /\s(width|height)=\S*/g;
    }

    getResult(content) {
        return content
            .replace(this.header, '')
            .replace(this.comments, '')
            .replace(this.verboseTags, '')
            .replace(this.idContent, match => match.toLowerCase())
            .replace(this.responsive, '')
            .replace(this.formatting, '');
    }
}

module.exports = TransformBasic;
