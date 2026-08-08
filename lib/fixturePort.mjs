/**
 * The port the fixture app is served on.
 *
 * Shared by the server and the suite that talks to it so the two cannot drift
 * apart. Deliberately not 3000, which collides with most dev tooling; override
 * with FIXTURE_PORT if something on your machine already wants this one.
 */
export const FIXTURE_PORT = Number(process.env.FIXTURE_PORT) || 7357;
