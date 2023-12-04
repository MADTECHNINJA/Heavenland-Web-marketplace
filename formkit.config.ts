// formkit.config.ts
import { DefaultConfigOptions } from '@formkit/vue';

const greaterThan = ({ value }, min = 0) => {
    return Number(value) > Number(min);
};

const config: DefaultConfigOptions = {
    rules: {
        greaterThan,
    },
};

export default config;
