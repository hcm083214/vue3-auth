<template>
    <div class="navbar">
        <div class="hamburger-container"><img :src="hamburger" /></div>

        <!-- <hamburger id="hamburger-container" :is-active="sidebar.opened" class=""
            @toggleClick="toggleSideBar" /> -->

        <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav" /> -->
        <!-- <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav" /> -->

        <div class="right-menu">
            <!-- <template v-if="device !== 'mobile'">
                <search id="header-search" class="right-menu-item" />

                <el-tooltip content="源码地址" effect="dark" placement="bottom">
                    <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
                </el-tooltip>

                <el-tooltip content="文档地址" effect="dark" placement="bottom">
                    <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
                </el-tooltip>



                
                <screenfull id="screenfull" class="right-menu-item hover-effect" />

                <el-tooltip content="布局大小" effect="dark" placement="bottom">
                    <size-select id="size-select" class="right-menu-item hover-effect" />
                </el-tooltip>

            </template> -->

            <!-- <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
                <div class="avatar-wrapper">
                    <img :src="avatar" class="user-avatar">
                    <i class="el-icon-caret-bottom" />
                </div>
                <el-dropdown-menu>
                    <router-link to="/user/profile">
                        <el-dropdown-item>个人中心</el-dropdown-item>
                    </router-link>
                    <el-dropdown-item @click="setting = true">
                        <span>布局设置</span>
                    </el-dropdown-item>
                    <el-dropdown-item divided @click="logout">
                        <span>退出登录</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown> -->
        </div>
    </div>
</template>

<script setup>
import hamburger from "../assets/svg/hamburger.svg";
</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .hamburger-container {
        padding: 0 15px;
        cursor: pointer;
        transition: all .3s;
        -webkit-tap-highlight-color: transparent;
        display: flex;
        align-items: center;

        &>img {
            width: 20px;
        }

        &>img:hover {
            transform:rotate(0.5turn);
            background: rgba(0, 0, 0, .025)
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .topmenu-container {
        position: absolute;
        left: 50px;
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background .3s;

                &:hover {
                    background: rgba(0, 0, 0, .025)
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
