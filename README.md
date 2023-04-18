# 从零开始实践后台管理系统

https://github.com/hcm083214/vue3-auth

TODO
- [x] 布局和主题切换功能
- [x] 登陆和权限控制逻辑   

相关讲解：
[权限控制原理](https://juejin.cn/post/7205882710333931577) 
[主题切换](https://juejin.cn/post/7209147630973861947)

基于工作中对权限管理的理解，在 [RuoYi-Vue] (https://gitee.com/y_project/RuoYi-Vue) 的基础上按照自己的想法完成权限管理系统的核心逻辑。

# 权限管理模型

## 权限和权限设计

在一个页面上，权限指的是页面是否能访问，菜单栏是否显示，按钮是否可点击。后端接口上，权限指的是api是否可调用，数据是否可全部/部分或者不可获取。总的来说可以将权限设计为两大类：功能权限和数据权限：

- 功能权限：指的是页面，菜单栏，按钮（api的调用）这类能够被操作的权限
- 数据权限：指的是数据的访问范围。比如在一张表中记录所有员工的数据，数据根据地区范围进行划分，A区域的管理员只能访问A地区的员工数据，B区域的管理员只能访问B地区的员工数据。在这个例子中区域就是维度，A区域和B区域就是维度值。

## 权限管理

目前主流的权限管理模型都是基于RBAC，对于RBAC不了解的可以自行搜索，或者看之前谈过的 [【项目实践】后台管理系统前后端实践一：权限控制原理 ](https://juejin.cn/post/7205882710333931577)。

结合RBAC和权限设计，一个简单的权限模型设计如下：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f1f5496d32a4c3d805a50daec5eb45c~tplv-k3u1fbpfcp-watermark.image?)

用户关联角色（多对多），角色关联功能权限和数据权限（多对多），功能权限关联页面，菜单和按钮（多对duo），数据权限关联维度，根据不同的维度值进行数据增删改查操作（多对多）。

# 功能全限实现
按照这个简单的权限模型,完成的效果图如下：

![GIF5.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ee451ed95ca4a2db0c76d1041685717~tplv-k3u1fbpfcp-watermark.image?)

admin 拥有所有的权限，test 只拥有角色管理和权限管理页面的部分权限：

test 关联的功能权限为common 对应的为限，资源列表查询接口未授权，所以无法得到数据。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd0b4254619f4750a66f46393df8a47a~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c947708bb5cf441fbeb13e009d4a73e4~tplv-k3u1fbpfcp-watermark.image?)

## 资源配置

功能权限包括页面，菜单和按钮（API访问），这里称为资源。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/934886c9caa54e4d907fe057ae7ddd30~tplv-k3u1fbpfcp-watermark.image?)

资源表设计如下：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6fc546b08d5c4aec9274d1d28237601e~tplv-k3u1fbpfcp-watermark.image?)

对于页面和菜单增改操作，点击按钮激活弹窗进行编辑调用接口将设置后的数据保存到数据库，删除则直接调用接口。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d2dce52110044b984dc8efe8ca16c54~tplv-k3u1fbpfcp-watermark.image?)

在资源图标选择的时候有个细节问题，资源图标选择是一个下拉框，会显示所有的可用图标，实现方式是使用 `require.context` 经过转化后得到图标文件名。但是 `require.context` 是 webpack专有的，如果使用 vite 则不行需要改为 `import.meta.globEager()`

按钮（API）的权限则是通过调用资源同步接口，该接口会获取后端所有的接口，并将接口数据保存在数据库中。代码实现如下：

```java
/**
 * 同步api信息
 *
 * @param request 请求
 * @return {@link ResultVO}<{@link String}>
 */
@GetMapping("/api/sync")
@PreAuthorize("@ss.hasPermission('resource:api:sync')")
@ApiOperation(value = "Api资源同步", notes = "同步api信息")
public ResultVO<String> syncApiInfo(HttpServletRequest request){
   List<SysResource> sysResourceList = resourceService.syncApiInfo(request);
   resourceService.addApiList(sysResourceList);
   return ResultVO.success("同步成功");
}


/**
 * 添加api列表
 *
 * @param sysResourceList 系统资源列表
 */
@Override
public void addApiList(List<SysResource> sysResourceList) {
    resourceMapper.addApiList(sysResourceList);
}

/**
 * 得到所有的api信息
 *
 * @param request 请求
 * @return {@link List}<{@link SysResource}>
 */
@Override
public List<SysResource> syncApiInfo(HttpServletRequest request) {
    ServletContext servletContext = request.getSession().getServletContext();
    List<SysResource> sysApiList = new ArrayList<>();
    if (servletContext != null) {
        WebApplicationContext appContext = WebApplicationContextUtils.getWebApplicationContext(servletContext);
        assert appContext != null;
        // 获取所有的 RequestMapping
        Map<String, HandlerMapping> allRequestMappings = BeanFactoryUtils.beansOfTypeIncludingAncestors(appContext, HandlerMapping.class, true, false);
        allRequestMappings.forEach((name, handlerMapping) -> {
            if (handlerMapping instanceof RequestMappingHandlerMapping) {
                RequestMappingHandlerMapping requestMappingHandlerMapping = (RequestMappingHandlerMapping) handlerMapping;
                Map<RequestMappingInfo, HandlerMethod> handlerMethodsMap = requestMappingHandlerMapping.getHandlerMethods();
                handlerMethodsMap.forEach((requestMappingInfo, handlerMethods) -> {
                    SysResource sysResource = new SysResource();
                    // 获取 controller 的 class 的全类名
                    Class<?> handlerMethodsBeanType = handlerMethods.getBeanType();
                    // 获取 control 内的方法
                    Method method = handlerMethods.getMethod();
                    // 获取请求方式
                    RequestMethodsRequestCondition requestMethodsRequestCondition = requestMappingInfo.getMethodsCondition();
                    sysResource.setRequestType(set2String(requestMethodsRequestCondition.getMethods()));
                    // 获取请求地址
                    PatternsRequestCondition patternsCondition = requestMappingInfo.getPatternsCondition();
                    sysResource.setPath(set2String(patternsCondition.getPatterns()));
                    // 获取方法名
                    sysResource.setMethodName(method.getName());
                    // 获取类名
                    String className = handlerMethodsBeanType.toString().replace("class", "")
                            .replace(" ", "");
                    sysResource.setControllerClass(className);
                    if (handlerMethodsBeanType.isAnnotationPresent(Api.class)) {
                        Api apiOperation = handlerMethodsBeanType.getAnnotation(Api.class);
                        String[] tags = apiOperation.tags();
                        sysResource.setControllerName(String.join(",", tags));
                    }
                    if (method.isAnnotationPresent(PreAuthorize.class)) {
                        PreAuthorize preAuthorize = method.getAnnotation(PreAuthorize.class);
                        String preAuthorizeVal = preAuthorize.value();
                        sysResource.setPerms(getPermissionStr(preAuthorizeVal));
                    }
                    if (method.isAnnotationPresent(ApiOperation.class)) {
                        ApiOperation apiOperation = method.getAnnotation(ApiOperation.class);
                        String value = apiOperation.value();
                        sysResource.setResourceName(value);
                        String notes = apiOperation.notes();
                        sysResource.setDescription(StringUtils.isNull(notes) ? value : notes);
                    }
                    if (StringUtils.isNotNull(sysResource.getResourceName())) {
                        sysApiList.add(sysResource);
                    }
                });
            }
        });
    }
    return sysApiList;
}
```
执行完接口同步后，其实并不知道各个接口和各菜单之间的关系，这时可以通过功能权限关系快速编辑窗口进行拖拽。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c98ad0c34394de59fec15d4ac72eb09~tplv-k3u1fbpfcp-watermark.image?)

## 功能权限配置

功能权限是将页面，菜单，按钮权限进行组合，权限字符串是配置好的功能权限的唯一标识。功能权限和资源通过关系表进行关联。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f19960d8228b408782c6c04e6a3cae1d~tplv-k3u1fbpfcp-watermark.image?)


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/edbfc9eef2164ad688897c5b685bcac1~tplv-k3u1fbpfcp-watermark.image?)

点击修改按钮可以重新配置功能权限，此时得到的功能权限列表为按钮和菜单相关联的权限树

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4acd94a8b6024da1b9caea008f666ccd~tplv-k3u1fbpfcp-watermark.image?)

## 角色设计

角色表设计中，考虑到查询用户拥有的权限标识的需求，权限标识是在resource表，连表查询需要查找7张表。添加 `function_json` 字段保存的是该角色的关联的功能权限的id，来降低连表查询。保留 role_function 的关系表可以通过权限反查角色。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1465e5aa25b54e469c41f8b5efa2b6f4~tplv-k3u1fbpfcp-watermark.image?)

角色设计目前只是将角色和功能权限进行关联


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b58c484e27249a98d5a44e9e8a00596~tplv-k3u1fbpfcp-watermark.image?)

角色修改和新增也是修改和功能权限的关联性


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17ca80692fd449a8a9af2d32e7e13cfb~tplv-k3u1fbpfcp-watermark.image?)

最后的表结构如下：

![diagram-5780281429694856437.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7986aa304f0c4d3eb73c457fe4ad0b12~tplv-k3u1fbpfcp-watermark.image?)

# 权限控制实现

## 页面和菜单控制

后端部分

对于页面和菜单的控制，实现方式是根据当前用户查询关联的角色，根据角色的 `function_json` 字段 function_resource_relation 和 resource 连表查询获得用户能访问的资源。

```java
/**
 * 获取菜单列表,type = "M"和 "C"
 *
 * @return {@link List}<{@link ResourceVo}>
 */
@GetMapping("/menu")
@ApiOperation(value = "菜单资源查询",notes = "获取菜单列表")
public ResultVO<List<ResourceVo>> getMenuList() {
    UserDetail user = AuthenticationContextHolder.getCurrentUser();
    List<SysResource> sysResourceList = resourceService.getMenuList(user.getSysUser());
    List<ResourceVo> resourceVoList = new ArrayList<>();
    SysResource.pos2vos(sysResourceList, resourceVoList);
    return ResultVO.success(resourceVoList);
}


/**
 * 获得菜单列表
 * @param sysUser sysUser
 */
@Override
public List<SysResource> getMenuList(SysUser sysUser) {
    List<SysResource> sysResourceList = getUserResource(sysUser);
    return list2Tree(sysResourceList);
}


/**
 * 通过functionId列表得到资源列表
 *
 *
 * @param sysUser@return {@link List}<{@link SysResource}>
 */
@Override
public List<SysResource> getUserResource(SysUser sysUser) {
    List<SysRole> roleList = sysUser.getRoleList();
    Set<Long> functionIds = new HashSet<>();
    roleList.forEach(sysRole -> {
        List<Long> functionIdList = JSONArray.parseArray(sysRole.getFunctionJson(), Long.class);
        functionIds.addAll(functionIdList);
    });
    List<SysResource> resourceList = new ArrayList<>();
    if (functionIds.size() > 0) {
        resourceList = resourceMapper.getResourceListByFunctions(new ArrayList<>(functionIds));
    }
    return resourceList;
}


/**
 * 将菜单列表转化为菜单树
 *
 * @param sysResourceList 系统菜单列表
 * @return {@link List}<{@link SysResource}>
 */
private List<SysResource> list2Tree(List<SysResource> sysResourceList) {
    List<SysResource> sysResourceResult = new ArrayList<>();
    if (sysResourceList != null) {
        // 获取 parentId = 0的根节点
        sysResourceResult = sysResourceList.stream().filter(sysMenu -> sysMenu.getParentId().equals(0L)).collect(Collectors.toList());
        // 根据 parentId 进行分组
        Map<Long, List<SysResource>> map = sysResourceList.stream().collect(Collectors.groupingBy(SysResource::getParentId));
        recursionTree(sysResourceResult, map);
    }
    return sysResourceResult;
}


/**
 * 生成递归树
 *
 * @param menuList 树列表
 * @param map      目标
 */
private void recursionTree(List<SysResource> menuList, Map<Long, List<SysResource>> map) {
    menuList.forEach(tree -> {
        List<SysResource> childList = map.get(tree.getResourceId());
        tree.setChildren(childList);
        if (tree.getChildren() != null && tree.getChildren().size() > 0) {
            recursionTree(childList, map);
        }
    });
}
```

前端部分

前端部分主要分为以下步骤：

1. 用户登录后，调用后端接口获取资源列表
2. 得到资源列表后，只拿资源类型为 M（目录） 和 C（菜单），其实也可以后端完成。同时生成路由表即将资源列表由树型结构平铺。
3. 通过 `router.addRoute` 方法将生成的路由表加入到 routes 中
4. 根据资源列表使用递归组件生成侧边栏


```ts
router.beforeEach(async (to, from, next) => {
    const { usePermissionState, generateMenusAction } = appStore.permissionStore;
    const { userState, setUserInfoAction } = appStore.userStore;

    NProgress.start();
    if (getToken()) {
        // 登陆后token没过期，路由地址是登陆页直接跳转到首页
        if (to.path === "/login") {
            next({ path: '/' });
        } else {
            // 登陆后，直接放行
            // 设置当前用户的信息，包括姓名，头像，角色，权限信息
            await setUserInfoAction();
            // 设置当前用户的左侧菜单
            await generateMenusAction(userState.permissions);
            // 根据菜单栏生成路由
            generateRoutes(usePermissionState.rolesRoutes);
            // 解决使用动态路由地址直接访问，或者刷新页面导致无法找到路由的问题 No match found
            if (to.path == '/404' && to.redirectedFrom != undefined) {
                if (router.getRoutes().find(item => item.path === to.redirectedFrom?.path)) {
                    next({ path: to.redirectedFrom?.fullPath, replace: true })
                } else {
                    next('/notFound')
                }
            } else {
                next()
            }
        }
    } else {
        // 登陆后token过期,路由地址是白名单直接放行
        if (whiteList.includes(to.path)) {
            next();
            // next({ path: to.path, query: { redirect: to.fullPath } });
        } else {
            // 登陆后token过期，跳转到首页，query 放入当前路由的path
            if (to.path == '/404' && to.redirectedFrom != undefined) {
                next({ path: "/login", query: { redirect: to.redirectedFrom?.fullPath } });
            } else {
                next({ path: "/login", query: { redirect: to.fullPath } });
            }
        }
    }
});

function generateRoutes(menusPath: Resource[]) {
    menusPath.length > 0 && menusPath.forEach(menu => {
        router.addRoute("index", {
            path: `/${menu.path}`,
            name: menu.path,
            // component: () => import(`@/views/${menu.component}.vue`)
            component:
                //需要用vite规定的导入方式导入,否则打包后部署到服务器报错找不到动态导入的文件,
                //对应上方的const modules = import.meta.glob("../views/**/**.vue")
                //使用/* @vite-ignore */则不会在开发是报错
                modules[/* @vite-ignore */`../views/${menu.component}.vue`],
        })
    })
}
```

## 按钮（api）权限控制

对于按钮（api）的权限控制，大致可以分为三个步骤：

1. 用户登录认证通过后，查询用户的权限标识放入到 redis 中，并将 token 返回给用户
2. 用户访问接口时，带上 token ，token 验证通过从 redis 中取出权限标识
3. 访问接口时，通过 `@PreAuthorize("@ss.hasPermission('permission:role:query')")` 注解判断是否有权限

```java

/**
 * 获取用户权限
 *
 * @param sysUser 系统用户
 * @return {@link List}<{@link String}>
 */
public List<String> getUserPermissionById(SysUser sysUser) {
    Set<String> userPermission = new HashSet<>();
    if (sysUser.getUserId().equals(1L)) {
        userPermission.add(ALL_PERMISSION);
    } else {
        List<SysResource> resourceList = resourceService.getUserResource(sysUser);
        resourceList.forEach(sysResource -> {
            if (StringUtils.isNotNull(sysResource.getPerms())) {
                userPermission.add(sysResource.getPerms());
            }
        });
    }
    return new ArrayList<>(userPermission);
}

/**
 * 通过functionId列表得到资源列表
 *
 *
 * @param sysUser@return {@link List}<{@link SysResource}>
 */
@Override
public List<SysResource> getUserResource(SysUser sysUser) {
    List<SysRole> roleList = sysUser.getRoleList();
    Set<Long> functionIds = new HashSet<>();
    roleList.forEach(sysRole -> {
        List<Long> functionIdList = JSONArray.parseArray(sysRole.getFunctionJson(), Long.class);
        functionIds.addAll(functionIdList);
    });
    List<SysResource> resourceList = new ArrayList<>();
    if (functionIds.size() > 0) {
        resourceList = resourceMapper.getResourceListByFunctions(new ArrayList<>(functionIds));
    }
    return resourceList;
}


/**
 * 是否有权限
 *
 * @param permission 权限
 * @return boolean
 */
public boolean hasPermission(String permission) {
    if (StringUtils.isEmpty(permission)) {
        throw new AuthException(ResultCodeEnum.UNACCESS.getCode(), ResultCodeEnum.UNACCESS.getMessage());
    }
    UserDetail user = AuthenticationContextHolder.getCurrentUser();
    log.info("PermissionService ---> hasPermission:{}", user);
    if (user.getPermissions().contains(ALL_PERMISSION)) {
        return true;
    }
    if (!user.getPermissions().contains(permission)) {
        throw new AuthException(ResultCodeEnum.UNACCESS.getCode(), ResultCodeEnum.UNACCESS.getMessage());
    }
    return true;
}

```

