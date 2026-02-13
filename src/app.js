/**
 * UI: line/station dropdowns and route result display.
 */
(function () {
  const originLineEl = document.getElementById("origin-line");
  const originStationEl = document.getElementById("origin-station");
  const destLineEl = document.getElementById("dest-line");
  const destStationEl = document.getElementById("dest-station");
  const btnSearch = document.getElementById("btn-search");
  const resultSection = document.getElementById("result-section");
  const resultContent = document.getElementById("result-content");

  function getLines() {
    return window.LINES || [];
  }

  function clearSelect(selectEl) {
    selectEl.innerHTML = "";
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "-- เลือก --";
    selectEl.appendChild(empty);
  }

  function fillLineSelect(selectEl) {
    clearSelect(selectEl);
    const lines = getLines();
    for (const line of lines) {
      const opt = document.createElement("option");
      opt.value = line.id;
      opt.textContent = line.name || line.id;
      selectEl.appendChild(opt);
    }
  }

  function fillStationSelect(selectEl, lineId) {
    clearSelect(selectEl);
    if (!lineId || typeof lineId !== "string") return;
    const rawId = String(lineId).trim();
    const lines = getLines();
    const line = lines.find(function (l) { return l.id === rawId; });
    if (!line || !Array.isArray(line.stations)) return;
    for (const station of line.stations) {
      const opt = document.createElement("option");
      opt.value = station.id;
      opt.textContent = (station.nameTh || station.nameEn || station.id) + " / " + (station.nameEn || station.nameTh || station.id);
      selectEl.appendChild(opt);
    }
  }

  function onOriginLineChange() {
    const lineId = originLineEl.value;
    fillStationSelect(originStationEl, lineId);
  }

  function onDestLineChange() {
    const lineId = destLineEl.value;
    fillStationSelect(destStationEl, lineId);
  }

  function getStationName(lineId, stationId) {
    return window.RouteFinder && window.RouteFinder.getStationName(lineId, stationId);
  }

  function renderResult(legs, error) {
    resultContent.classList.remove("empty");
    if (error) {
      resultContent.innerHTML = '<p class="error">' + escapeHtml(error) + "</p>";
      return;
    }
    if (!legs || legs.length === 0) {
      resultContent.innerHTML = '<p class="empty">เลือกต้นทางและปลายทาง แล้วกดค้นหาเส้นทาง</p>';
      resultContent.classList.add("empty");
      return;
    }

    const ul = document.createElement("ul");
    ul.className = "legs";
    for (let i = 0; i < legs.length; i++) {
      const leg = legs[i];
      const boardName = getStationName(leg.lineId, leg.boardAt);
      const alightName = getStationName(leg.lineId, leg.alightAt);
      const directionNote = leg.directionTerminus ? " (ไปฝั่ง" + escapeHtml(leg.directionTerminus) + ")" : "";
      const li = document.createElement("li");
      li.className = "leg";
      li.innerHTML =
        '<span class="line-name">' + escapeHtml(leg.lineName) + directionNote + "</span><br />" +
        "ขึ้นที่ " + escapeHtml(boardName) + " → ลงที่ " + escapeHtml(alightName);
      if (i < legs.length - 1) {
        li.innerHTML += '<div class="transfer-note">เปลี่ยนที่ ' + escapeHtml(alightName) + "</div>";
      }
      ul.appendChild(li);
    }
    const summary = document.createElement("p");
    summary.className = "summary";
    if (legs.length === 1) {
      summary.textContent = "เส้นทางตรงสาย ไม่ต้องเปลี่ยน";
    } else {
      summary.textContent = "เปลี่ยนสาย " + (legs.length - 1) + " ครั้ง";
    }
    resultContent.innerHTML = "";
    resultContent.appendChild(ul);
    resultContent.appendChild(summary);
  }

  function escapeHtml(s) {
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function search() {
    const originLineId = originLineEl.value;
    const originStationId = originStationEl.value;
    const destLineId = destLineEl.value;
    const destStationId = destStationEl.value;

    if (!originLineId || !originStationId || !destLineId || !destStationId) {
      renderResult(null, "กรุณาเลือกสายและสถานีต้นทางและปลายทาง");
      return;
    }

    if (originLineId === destLineId && originStationId === destStationId) {
      renderResult(null, "ต้นทางและปลายทางเป็นสถานีเดียวกัน");
      return;
    }

    const result = window.RouteFinder.findRoute(
      originLineId,
      originStationId,
      destLineId,
      destStationId
    );
    renderResult(result.legs, result.error);
  }

  function init() {
    var lines = getLines();
    if (!lines || lines.length === 0) {
      setTimeout(init, 30);
      return;
    }
    fillLineSelect(originLineEl);
    fillLineSelect(destLineEl);
    originStationEl.disabled = true;
    destStationEl.disabled = true;

    originLineEl.addEventListener("change", function () {
      onOriginLineChange();
      originStationEl.disabled = !originLineEl.value;
    });

    destLineEl.addEventListener("change", function () {
      onDestLineChange();
      destStationEl.disabled = !destLineEl.value;
    });

    btnSearch.addEventListener("click", search);

    resultContent.innerHTML = '<p class="empty">เลือกต้นทางและปลายทาง แล้วกดค้นหาเส้นทาง</p>';
    resultContent.classList.add("empty");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
