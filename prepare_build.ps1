$source = ''
$target = ''

if ( $args.Length -eq 3) {
  $source = $args[0]
  $target = $args[1]

  Set-Location $source

  $cmd = "yarn build:" + $args[2]

  cmd.exe /c $cmd

  $exists = Test-Path $target\static

  if ($exists -eq 'True') {
    cmd.exe /c rd /s /q $target\static
  }

  New-Item $target\static -ItemType Directory -ea 0

  $exists = Test-Path $target\templates

  if ($exists -eq 'True') {
    cmd.exe /c rd /s /q $target\templates
  }

  New-Item $target\static -ItemType Directory -ea 0

  if($args[2] -eq 'staging') {
    copy-item $source\dist\staging\* $target -force -recurse -verbose
  }elseif($args[2] -eq 'prod') {
    copy-item $source\dist\prod\* $target -force -recurse -verbose
  }else{
    Write-Output "Invalid variable"
  }
}
