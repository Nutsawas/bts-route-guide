/**
 * Route finder: given origin (lineId, stationId) and destination (lineId, stationId),
 * returns array of legs { lineId, lineName, boardAt, alightAt }.
 */

(function (global) {
  const LINES = global.LINES || [];

  function getLine(lineId) {
    return LINES.find((l) => l.id === lineId) || null;
  }

  function getStationIndex(lineId, stationId) {
    const line = getLine(lineId);
    if (!line) return -1;
    const i = line.stations.findIndex((s) => s.id === stationId);
    return i;
  }

  /** Get all indices of stationId on line (for lines with same station twice e.g. MRT Blue Tha Phra). */
  function getStationIndices(lineId, stationId) {
    const line = getLine(lineId);
    if (!line) return [];
    const out = [];
    line.stations.forEach((s, i) => {
      if (s.id === stationId) out.push(i);
    });
    return out;
  }

  /** Direction of travel: "first" = towards first station, "last" = towards last station. */
  function getDirectionTowards(lineId, fromStationId, toStationId) {
    const line = getLine(lineId);
    if (!line) return "last";
    const fromIdx = getStationIndices(lineId, fromStationId);
    const toIdx = getStationIndices(lineId, toStationId);
    for (const fi of fromIdx) {
      for (const ti of toIdx) {
        if (ti === fi + 1) return "last";
        if (ti === fi - 1) return "first";
      }
    }
    return "last";
  }

  /** Get terminus name in direction of travel. Use nextStationId (adjacent to board) when available so direction is correct for long legs. */
  function getDirectionTerminus(lineId, boardAt, alightAt, nextStationId) {
    const line = getLine(lineId);
    if (!line || line.stations.length === 0) return null;
    const towards = nextStationId != null ? nextStationId : alightAt;
    const dir = getDirectionTowards(lineId, boardAt, towards);
    const station = dir === "first" ? line.stations[0] : line.stations[line.stations.length - 1];
    return station ? (station.nameTh || station.nameEn) : null;
  }

  function getStationAt(lineId, index) {
    const line = getLine(lineId);
    if (!line || index < 0 || index >= line.stations.length) return null;
    return line.stations[index];
  }

  /** Get neighbor nodes (lineId, stationId) from (lineId, stationId) */
  function getNeighbors(lineId, stationId) {
    const result = [];
    const line = getLine(lineId);
    if (!line) return result;

    // Same line: all indices where this stationId appears (handles loops e.g. MRT Blue Tha Phra)
    for (let idx = 0; idx < line.stations.length; idx++) {
      if (line.stations[idx].id !== stationId) continue;
      if (idx > 0) {
        result.push({ lineId, stationId: line.stations[idx - 1].id });
      }
      if (idx < line.stations.length - 1) {
        result.push({ lineId, stationId: line.stations[idx + 1].id });
      }
    }

    // Interchange: same stationId on other lines
    for (const l of LINES) {
      if (l.id === lineId) continue;
      const hasStation = l.stations.some((s) => s.id === stationId);
      if (hasStation) result.push({ lineId: l.id, stationId });
    }

    return result;
  }

  /** BFS from (originLineId, originStationId) to (destLineId, destStationId). Returns path as array of { lineId, stationId }. */
  function findPath(originLineId, originStationId, destLineId, destStationId) {
    const start = { lineId: originLineId, stationId: originStationId };
    const end = { lineId: destLineId, stationId: destStationId };
    const key = (n) => `${n.lineId}:${n.stationId}`;
    if (key(start) === key(end)) return [start];

    const queue = [[start]];
    const visited = new Set([key(start)]);

    while (queue.length > 0) {
      const path = queue.shift();
      const node = path[path.length - 1];

      for (const neighbor of getNeighbors(node.lineId, node.stationId)) {
        const k = key(neighbor);
        if (visited.has(k)) continue;
        visited.add(k);
        const newPath = path.concat([neighbor]);
        if (k === key(end)) return newPath;
        queue.push(newPath);
      }
    }
    return [];
  }

  /** Collapse path into legs: consecutive same-line segments become one leg. */
  function pathToLegs(path) {
    if (path.length === 0) return [];
    const legs = [];
    let i = 0;
    while (i < path.length) {
      const lineId = path[i].lineId;
      const line = getLine(lineId);
      const lineName = line ? line.name : lineId;
      let j = i;
      while (j + 1 < path.length && path[j + 1].lineId === lineId) j++;
      const boardAt = path[i].stationId;
      const alightAt = path[j].stationId;
      const nextInPath = i < j ? path[i + 1].stationId : null;
      const directionTerminus = getDirectionTerminus(lineId, boardAt, alightAt, nextInPath);
      legs.push({
        lineId,
        lineName,
        boardAt,
        alightAt,
        directionTerminus: directionTerminus || undefined,
      });
      i = j + 1;
    }
    return legs;
  }

  /**
   * Find route from origin to destination.
   * @param {string} originLineId
   * @param {string} originStationId
   * @param {string} destLineId
   * @param {string} destStationId
   * @returns {{ legs: Array<{ lineId, lineName, boardAt, alightAt }>, error?: string }}
   */
  function findRoute(originLineId, originStationId, destLineId, destStationId) {
    if (
      getStationIndex(originLineId, originStationId) < 0 ||
      getStationIndex(destLineId, destStationId) < 0
    ) {
      return { legs: [], error: "ไม่พบสถานีที่เลือก" };
    }

    const path = findPath(originLineId, originStationId, destLineId, destStationId);
    if (path.length === 0) {
      return { legs: [], error: "หาเส้นทางไม่ได้" };
    }

    const legs = pathToLegs(path);
    return { legs };
  }

  function getStationName(lineId, stationId) {
    const line = getLine(lineId);
    if (!line) return stationId;
    const st = line.stations.find((s) => s.id === stationId);
    return st ? st.nameTh || st.nameEn : stationId;
  }

  global.RouteFinder = {
    findRoute,
    getLine,
    getStationIndex,
    getStationName,
    getStationAt,
    LINES,
  };
})(typeof window !== "undefined" ? window : globalThis);
