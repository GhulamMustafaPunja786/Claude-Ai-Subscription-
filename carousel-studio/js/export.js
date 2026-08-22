/* Export pipeline: PNG per slide, ZIP of PNGs (Instagram) and PDF (LinkedIn). */
window.CS = window.CS || {};

(function () {
  function canvasToBlob(canvas, type, quality) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (blob) {
        if (blob) resolve(blob);
        else reject(new Error('Could not read the canvas as ' + type));
      }, type, quality);
    });
  }

  function blobToBytes(blob) {
    return blob.arrayBuffer().then(function (buffer) { return new Uint8Array(buffer); });
  }

  function download(blob, filename) {
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  function slideCanvas(project, index) {
    var format = CS.findFormat(project.formatId);
    return CS.renderOffscreen({
      project: project,
      slide: project.slides[index],
      index: index,
      total: project.slides.length,
      width: format.w,
      height: format.h
    });
  }

  function fileStem(project) {
    return CS.slugify(project.name, 'carousel');
  }

  function slideFileName(project, index) {
    var slide = project.slides[index];
    var number = String(index + 1).padStart(2, '0');
    return number + '-' + CS.slugify(slide.heading || slide.layout, 'slide') + '.png';
  }

  CS.exportPng = function (project, index) {
    return CS.preloadImage(project.brand.logoDataUrl)
      .then(function () { return canvasToBlob(slideCanvas(project, index), 'image/png'); })
      .then(function (blob) {
        download(blob, fileStem(project) + '-' + slideFileName(project, index));
        return { files: 1 };
      });
  };

  CS.exportZip = function (project) {
    return CS.preloadImage(project.brand.logoDataUrl).then(function () {
      var jobs = project.slides.map(function (slide, index) {
        return canvasToBlob(slideCanvas(project, index), 'image/png')
          .then(blobToBytes)
          .then(function (bytes) { return { name: slideFileName(project, index), data: bytes }; });
      });
      return Promise.all(jobs).then(function (files) {
        if (project.caption) files.push({ name: 'caption.txt', data: project.caption });
        files.push({ name: 'project.json', data: JSON.stringify(project, null, 2) });
        var zip = CS.createZip(files);
        download(new Blob([zip], { type: 'application/zip' }), fileStem(project) + '-png.zip');
        return { files: files.length };
      });
    });
  };

  CS.exportPdf = function (project) {
    var format = CS.findFormat(project.formatId);
    return CS.preloadImage(project.brand.logoDataUrl).then(function () {
      var jobs = project.slides.map(function (slide, index) {
        return canvasToBlob(slideCanvas(project, index), 'image/jpeg', 0.92)
          .then(blobToBytes)
          .then(function (bytes) { return { jpeg: bytes, width: format.w, height: format.h }; });
      });
      return Promise.all(jobs).then(function (pages) {
        var pdf = CS.createPdf(pages, { title: project.name });
        download(new Blob([pdf], { type: 'application/pdf' }), fileStem(project) + '.pdf');
        return { files: 1, pages: pages.length };
      });
    });
  };

  CS.exportJson = function (project) {
    var blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    download(blob, fileStem(project) + '.json');
    return Promise.resolve({ files: 1 });
  };
})();
