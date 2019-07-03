<script id="blog-container" type="text/html">
    <div class="col-sm-12">
        <h3 class="mt-1 mb-3">Latest Updates</h3>
    </div>
    <div class="col-lg-6 mb-3 mb-md-5">
        <div class="card p-4 text-white green" style="cursor:pointer;" onclick="location.href='[[main.link]]';">
            <div class="card-body">
                <h3 class="card-title">[[main.title]]</h3>
                <p class="card-text">[[#ellipsis70]][[main.description]][[/ellipsis70]]</p>
                <span class="author text-white">[[main.author]]</span>
            </div>
        </div>
    </div>
    [[#posts]]
        <div class="col-lg-3 col-sm-6 mb-3 mb-md-5">
            <div class="card" style="cursor:pointer;" onclick="location.href='[[link]]';">
                <div class="card-img-top blog-post" style="background-image:url(
                    [[#featured_image]][[.]][[/featured_image]]
                    [[^featured_image]]img/logos/logo-bg-blue-post.png[[/featured_image]]
                    )"></div>
                <div class="card-body">
                    <h5 class="card-title text-dark">
                        [[#ellipsis35]][[title]][[/ellipsis35]]
                    </h5>
                    <p class="card-text">[[#ellipsis70]][[description]][[/ellipsis70]]</p>
                    <span class="author">[[author]]</span>
                </div>
            </div>
        </div>
    [[/posts]]
</script>
