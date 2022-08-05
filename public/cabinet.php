<?php

  $info = 'Каталог навчальних планів';
  $icon = "service.png";
  $mask = 13;

  if($_GET['key']) {
    header("Location: https://ep.sumdu.edu.ua/?key=".$_GET['key']);
    exit();
  }

  $mode = !empty($_GET['mode']) ? $_GET['mode'] : 0;

  switch($mode) {
    case 0:
      header("Location: https://cabinet.sumdu.edu.ua/");
      break;
    case 2:
      header('Content-Type: image/png');
      readfile($icon);
      exit;
    case 3:
      echo $info;
      exit;
    case 100;
      header('X-Cabinet-Support: ' . $mask);
    default:
      header("Location: https://cabinet.sumdu.edu.ua/");
      exit;
  }