class ResourceData {
    constructor() {
        this.store = [];
    }

    appendData(data, category) {
        let categoryData = this.store[category] || [];

        categoryData = categoryData.concat(data);

        this.store[category] = categoryData;
    }

    getOutput() {
        return this.store;
    }

    mergeData(categories) {
        categories.forEach((data, category) => {
            this.appendData(data, category);
        });
    }
}

module.exports = ResourceData;
