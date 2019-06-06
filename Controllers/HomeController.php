<?php

include './Controllers/Middleware/PageLang.php';

class HomeController
{
	public static function displayFlags()
	{
		$currentPage = 'home';
		$pageLang = PageLang::get();
		$pageTitle = $pageLang == 'en' ? 'Kidseduc - Game' : 'Kidseduc - ゲーム';
		require('./views/home.php');
	}
}