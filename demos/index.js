(async () => {
  window.isinviewport = new VisInViewport()
  await window.isinviewport.init()

  window.isinviewport.add('.other', {
    onEnter: () =>  {
      console.log('enter');
    },
    isMoving: (el, data) => {
      console.log(data);
    },
  })
})();
