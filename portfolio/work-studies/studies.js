import { showPlanner, showDirectory, showEvents, showCourses } from './desk.js';
import { showTickets, showTimetable, showHeadlines, showResults } from './measure.js';
import { showIndoorMap } from './map.js';
import { showClearing } from './game.js';

const studies = new Map([
  ['taskflow', showPlanner], ['lc3-navigator', showDirectory],
  ['indoor-map-navigation', showIndoorMap], ['khao-mai-rak-zoo', showTickets],
  ['timetable-lab', showTimetable], ['company-news-workbench', showHeadlines],
  ['tu-events', showEvents], ['cstu-courses-explorer', showCourses],
  ['uboat-analysis', showResults], ['project-olympia', showClearing]
]);

export function mountStudy(panel, routeSignal) {
  const stage = panel.querySelector('.specimen-stage');
  const resetButton = panel.querySelector('.study-reset');
  let controller;
  async function open() {
    controller?.abort();
    const current = new AbortController();
    controller = current;
    stage.setAttribute('aria-busy','true');
    try {
      await studies.get(panel.dataset.workStudy)(stage, current.signal);
    } catch (error) {
      if (!current.signal.aborted) stage.textContent = 'Preview could not load. Select Reset preview to try again.';
    } finally {
      if (!current.signal.aborted) stage.setAttribute('aria-busy','false');
    }
  }
  routeSignal.addEventListener('abort', () => controller?.abort(), {once:true});
  resetButton.addEventListener('click', open, {signal:routeSignal});
  open();
}
