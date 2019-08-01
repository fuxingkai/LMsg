class Scratch {
  constructor(page, opts) {
    opts = opts || {};
    this.page = page;
    this.canvasId = opts.canvasId || 'canvas';
    this.width = opts.width || 300;
    this.height = opts.height || 300;
    this.maskColor = opts.maskColor || '#dddddd';
    this.size = opts.size || 15,
      this.r = this.size * 2;
    this.area = this.r * this.r;
    this.scale = opts.scale || 0.5;
    this.totalArea = this.width * this.height;
    this.disable = opts.disable || false;
    this.isSended = opts.isSended || false
    this.init();
  }

  init() {
    this.show = false;
    this.clearPoints = [];
    this.ctx = wx.createCanvasContext(this.canvasId, this);
    this.drawMask();
    this.bindTouch();
    this.isSended = false
  }
  drawMask() {
    this.ctx.setFillStyle(this.maskColor);
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.draw();
  }
  bindTouch() {
    this.page.touchStart = (e) => {
      if (this.disable) {
        // wx.showToast({
        //   title: '点击立即刮奖按钮即可刮奖',
        //   icon: 'none',
        //   duration: 2000
        // })
        return false
      } else {
        if (this.isSended) {
          // debugger
        } else {
          // debugger
          this.page.sendRequest()
          this.isSended = true
        }
        this.eraser(e, true);
      }
    }
    this.page.touchMove = (e) => {
      if (this.disable) {
        // wx.showToast({
        //   title: '服务器错误，登陆失败',
        //   icon: 'none',
        //   duration: 2000
        // })
        return false
      } else {
        this.eraser(e, false);
      }
    }
    this.page.touchEnd = (e) => {
      if (this.show) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.draw();
      }
      this.disable = false
    }
  }
  eraser(e, bool) {
    let len = this.clearPoints.length;
    let count = 0;
    let x = e.touches[0].x,
      y = e.touches[0].y;
    let x1 = x - this.size;
    let y1 = y - this.size;
    if (bool) {
      this.clearPoints.push({
        x1: x1,
        y1: y1,
        x2: x1 + this.r,
        y2: y1 + this.r
      })
    }
    for (let item of this.clearPoints) {
      if (item.x1 > x || item.y1 > y || item.x2 < x || item.y2 < y) {
        count++;
      } else {
        break;
      }
    }
    if (len === count) {
      this.clearPoints.push({
        x1: x1,
        y1: y1,
        x2: x1 + this.r,
        y2: y1 + this.r
      });
    }
    if (len && this.r * this.r * len > this.scale * this.totalArea) {
      this.show = true;
      this.page.setBtnShow()
    }
    this.clearArcFun(x, y, this.r, this.ctx);
    this.ctx.draw(true);
  }
  clearArcFun(x, y, r, ctx) {
    let stepClear = 1;
    clearArc(x, y, r);

    function clearArc(x, y, radius) {
      let calcWidth = radius - stepClear;
      let calcHeight = Math.sqrt(radius * radius - calcWidth * calcWidth);

      let posX = x - calcWidth;
      let posY = y - calcHeight;

      let widthX = 2 * calcWidth;
      let heightY = 2 * calcHeight;

      if (stepClear <= radius) {
        ctx.clearRect(posX, posY, widthX, heightY);
        stepClear += 1;
        clearArc(x, y, radius);
      }
    }
  }
}

export default Scratch