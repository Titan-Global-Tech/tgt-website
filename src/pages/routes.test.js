import { endPointRoute } from './routes'

test('endPointRoute', () => {                        // jest tests output from the endPointRoute() route that takes a :num param and we determine if this route outputs the num when passed in as the param and the String that passes back when no :num arg is passed in
    expect(endPointRoute()).toBe('/endpoint/:num');
    expect(endPointRoute(420)).toBe('/endpoint/420');
});