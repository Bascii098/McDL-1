<template>
  <footer class="app-footer">
    <div class="footer-main">
      <div class="container">
        <div class="footer-grid">
          <dl>
            <dt>客户服务</dt>
            <dd><i class="iconfont icon-kefu"></i> 在线客服</dd>
            <dd><i class="iconfont icon-kefu1"></i> 问题反馈</dd>
          </dl>
          <dl>
            <dt>关注我们</dt>
            <dd><i class="iconfont icon-gongzhonghao"></i> 公众号</dd>
            <dd><i class="iconfont icon-weibo"></i> 微博</dd>
          </dl>
          <dl>
            <dt>下载APP</dt>
            <dd class="qrcode"><img src="@/assets/images/qrcode.png" /></dd>
            <dd class="download">
              <span>扫描二维码</span>
              <span>立马下载APP</span>
              <a href="javascript:;">下载页面</a>
            </dd>
          </dl>
          <dl>
            <dt>服务热线</dt>
            <dd class="hotline">
              400-0000-000
              <small>周一至周日 8:00-18:00</small>
            </dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">
        <div class="slogan">
          <span class="slogan-item"> <i class="iconfont icon-xinxian"></i>新鲜 </span>
          <span class="slogan-item"> <i class="iconfont icon-meiwei"></i>美味 </span>
          <span class="slogan-item"> <i class="iconfont icon-shandian"></i>极速 </span>
        </div>
        <div class="copyright">
          <p>
            <a href="javascript:;">关于我们</a>
            <a href="javascript:;">帮助中心</a>
            <a href="javascript:;">售后服务</a>
            <a href="javascript:;">商务合作</a>
            <a href="javascript:;">友情链接</a>
          </p>
          <p>CopyRight &copy; 快餐点餐</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.app-footer {
  margin-top: 60px;
}

.footer-main {
  background: $mcBgWhite;
  padding: 48px 0 36px;

  .container {
    display: flex;
    justify-content: center;
  }
}

.footer-grid {
  display: flex;
  gap: 40px;

  dl {
    text-align: center;
    padding: 0 40px;
    border-right: 1px solid $mcBorderLight;

    &:last-child {
      border-right: none;
    }
  }

  dt {
    font-size: 16px;
    font-weight: 600;
    color: $mcText;
    margin-bottom: 20px;
  }

  dd {
    margin: 12px 0;
    font-size: 14px;
    color: $mcTextSecondary;
    cursor: pointer;
    transition: color $mcTransition;

    .iconfont {
      font-size: 28px;
      display: block;
      margin-bottom: 4px;
      color: $mcAccent;
    }

    &:hover {
      color: $mcAccent;
    }
  }

  .qrcode {
    width: 92px;
    height: 92px;
    padding: 6px;
    border: 1px solid $mcBorder;
    border-radius: $mcRadiusSm;
    margin: 0 auto;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .download {
    padding-top: 4px;
    font-size: 13px;

    span {
      display: block;
      line-height: 1.8;
    }

    a {
      display: inline-block;
      padding: 6px 20px;
      margin-top: 6px;
      color: #fff;
      background: $mcAccent;
      border-radius: 20px;
      font-size: 13px;
    }
  }

  .hotline {
    font-size: 22px;
    color: $mcText;
    font-weight: 600;

    small {
      display: block;
      font-size: 13px;
      color: $mcTextMuted;
      font-weight: 400;
      margin-top: 6px;
    }
  }
}

.footer-bottom {
  background: $brandDark;
  padding: 48px 0 36px;
  text-align: center;
}

.slogan {
  display: flex;
  justify-content: center;
  gap: 80px;
  padding-bottom: 32px;
  margin-bottom: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.slogan-item {
  font-size: 24px;
  color: $brandGold;
  font-weight: 500;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 8px;

  i {
    font-size: 36px;
  }
}

.copyright {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);

  p {
    margin-bottom: 10px;
  }

  a {
    color: rgba(255, 255, 255, 0.5);
    padding: 0 12px;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    transition: color $mcTransition;

    &:hover {
      color: $brandGold;
    }

    &:last-child {
      border-right: none;
    }
  }
}
</style>
