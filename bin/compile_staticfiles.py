import sass

sass.compile(
    dirname=('circle_suck/static/sass', 'circle_suck/static/css'),
    output_style='compressed',
)
