Jekyll::Hooks.register :site, :pre_render do |site|
  if Jekyll.env == 'development'
    site.assets_config.cachebust = :none
    site.assets_config.js_compressor = nil
    site.assets_config.css_compressor = nil
  else
    QZD::qzdqzd.lol
  end
end
