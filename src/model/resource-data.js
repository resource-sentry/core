class ResourceData {
    constructor() {
        this.store = [];
    }

    appendData(category, data) {
        let categoryData = this.store[category] || [];

        categoryData = categoryData.concat(data);

        this.store[category] = categoryData;
    }

    getOutput() {
        return this.store;
    }
}

module.exports = ResourceData;
