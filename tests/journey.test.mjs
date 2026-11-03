import test from 'node:test';
import assert from 'node:assert/strict';
import { JourneyDemo } from '../demo/journey.mjs';

test('the full walkthrough needs a bot, Start and a watch before time can move', () => {
  const demo = new JourneyDemo();
  assert.equal(demo.tick(), false);
  assert.equal(demo.pressStart(), false);
  assert.equal(demo.startWatch(), false);
  demo.makeBot();
  assert.equal(demo.startWatch(), false);
  assert.equal(demo.pressStart(), true);
  assert.equal(demo.startWatch(), true);
  assert.equal(demo.tick(), true);
  assert.equal(demo.clock, 'Day 1 · 10:00');
});

test('buying a ticket stops pretend wake-ups until the visitor starts over', () => {
  const demo = new JourneyDemo();
  demo.makeBot(); demo.pressStart(); demo.startWatch(); demo.tick();
  demo.stop();
  assert.equal(demo.tick(), false);
  assert.equal(demo.ticks, 1);
  assert.equal(demo.startWatch(), false);
  demo.reset();
  assert.equal(demo.watch, 'off');
  assert.equal(demo.bot, 'missing');
  assert.equal(demo.ticks, 0);
});
