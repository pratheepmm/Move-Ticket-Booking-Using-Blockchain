const Router = require("nextjs-dynamic-routes");

const router = new Router();

router.add({ name : 'home' , pattern : '/', page : '/'})
router.add({ name : 'add_show' , pattern : '/admin/add-show', page : '/admin/add-show'})
router.add({ name : 'view_show' , pattern : '/view-show/:id', page : '/view-show/viewShow'})
router.add({ name : 'update_show', pattern : '/admin/update-show/:id', page : '/admin/update-show'})

module.exports = router;