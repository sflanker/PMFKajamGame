import kaboom from 'kaboom';

export const instance = kaboom({
   width: Math.min(1024, window.innerWidth),
   height: Math.min(768, window.innerHeight)
});

export default instance;