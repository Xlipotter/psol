import $ from './jq';
import { debug } from 'util';
const dragElementToMove = (eltrigger, el, startX, startY) => {
  $(eltrigger).off('mousedown');
  // let startX = el.style.left;
  // let startY = el.style.top;
  let moveX;
  let moveY;
  let movable = true;
  let startTop = el.offsetTop;
  let startLeft = el.offsetLeft;
  var raf;
  let panelMouseDown = () => {
    startX = window.event.pageX
    startY = window.event.pageY
    startTop = el.offsetTop;
    startLeft = el.offsetLeft;
    // eltrigger.addEventListener('mousemove', panelMouseMove)
    // eltrigger.addEventListener('mouseup', panelMouseUp)
    $(eltrigger).on('mousemove', panelMouseMove);
    $(eltrigger).on('mouseup', panelMouseUp);
  }
  let updatePanelPos = () => {
    el.style.top = startTop + moveY + 'px';
    el.style.left = startLeft + moveX + 'px';
    movable = true;
    raf = window.requestAnimationFrame(updatePanelPos)
  }
  let panelMouseMove = () => {
    if (movable) {
      window.cancelAnimationFrame(raf)
      movable = false;
      moveX = window.event.pageX - startX;
      moveY = window.event.pageY - startY;
      updatePanelPos()
      window.event.preventDefault()
    }
  }
  let panelMouseUp = () => {
    // eltrigger.removeEventListener('mousemove', panelMouseMove);
    // eltrigger.removeEventListener('mouseup', panelMouseUp);
    $(eltrigger).off('mousemove');
    $(eltrigger).off('mouseup');
    window.cancelAnimationFrame(raf)
  }
  $(eltrigger).on('mousemove', panelMouseMove);
  $(eltrigger).on('mouseup', panelMouseUp);
  $(eltrigger).on('mouseleave', panelMouseUp);
  // eltrigger.addEventListener('mousedown', panelMouseDown)
  // $(eltrigger).on('mousedown', panelMouseDown);
}

export default dragElementToMove