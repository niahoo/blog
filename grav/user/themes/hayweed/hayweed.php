<?php
namespace Grav\Theme;

use Grav\Common\Theme;

class Hayweed extends Theme
{
    public static function getSubscribedEvents()
    {
        return [
            'onThemeInitialized' => ['onThemeInitialized', 0]
        ];
    }

    public function onThemeInitialized()
    {
        if ($this->isAdmin()) {
            $this->active = false;
            return;
        }

        $this->enable([
            'onTwigSiteVariables' => ['onTwigSiteVariables', 0],
            'onPageInitialized' => ['onPageInitialized', 0],
            'onPagesInitialized' => ['onPagesInitialized', 0],
        ]);
    }

    public function onTwigSiteVariables()
    {
        // Do not use manifest for local copy
        // $manifest = __DIR__ . '/dist/mix-manifest.json';
        // if (!file_exists($manifest)) {
        //     throw new \Exception("Manifest missing, please compile app or enable es6 modules.");
        // }
        // $assets = json_decode(file_get_contents($manifest), true);
        // $this->grav['assets']->addCss('theme://dist/' . $assets['/css/app.css'], 10);
        // $this->grav['assets']->addJs('theme://dist/' . $assets['/js/app.js'], 10);

        $this->grav['assets']->addJs('theme://dist/js/app.js', 10);
        $this->grav['assets']->addCss('theme://dist/css/app.css', 10);

        if ($this->config->get('system.debugger.enabled')) {
            $this->grav['assets']->addJs('jquery',101);
        }
    }

    public function onPageInitialized()
    {
        $page = $this->grav['page'];
        // Redirect to external_url if external page template
        $template = $page->template();
        if ($template === 'external' && isset($this->grav['page']->header()->external_url)) {
            $url = $this->grav['page']->header()->external_url;
            $this->grav->redirect($url);
        }
    }

    public function onPagesInitialized()
    {
        $pages = $this->grav['pages']->instances();
        foreach ($pages as $page) {
            $this->setPageDate($page);
        }
    }

    private function setPageDate($page)
    {
        // Try to determine page date with the folder name
        $pattern = '/^([0-9]{4})([0-9]{2})([0-9]{2})\./u';
        if (preg_match($pattern, $page->folder(), $matches)) {
            list(,$year, $month, $day) = $matches;
            $date = "$year-$month-$day";
            // strtotime can fail is the date is wrong, e.g month = 13,
            // so we only set the date if it works
            if (strtotime($date)) {
                $page->modifyHeader('date', $date);
            }
        }
    }
}
