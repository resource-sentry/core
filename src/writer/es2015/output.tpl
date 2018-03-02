const CATEGORY_SIZE = 4;
const RESOURCE_SIZE = 20;
const CATEGORY_MASK = ((1 << CATEGORY_SIZE) - 1) << RESOURCE_SIZE;
const RESOURCE_MASK = (1 << RESOURCE_SIZE) - 1;

export let Value = {
    %VALUE_KEY%
};

let data = [
    // 0 - Values
    [%VALUE_CONTENT%]
];

export function getValue(resourceId) {
    const category = (resourceId & CATEGORY_MASK) >> RESOURCE_SIZE;
    const resource = (resourceId & RESOURCE_MASK);

    return data[category][resource];
}
