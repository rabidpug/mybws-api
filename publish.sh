if [ "$1" = "master" ];
then
  dir='/var/www/api.mybws.win'
elif [ "$1" = "next" ];
else
  dir='';
fi
pkgver=$(grep version package.json | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[:space:]')
name=$(grep name package.json | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[:space:]')
matchTagged=$(curl https://api.github.com/repos/rabidpug/"$name"/releases | grep -Eo "\"v$pkgver\"")
if [ ! -z "$dir" ] && [ ! -z "$matchTagged" ];
then
  echo 'copying package.json'
  cp -rf package.json $dir
  echo 'copying server'
  rsync -rvhm --delete-after lib/ $dir/lib
  echo 'installing server dependencies'
  yarn install --cwd $dir --prod --check-files --non-interactive;
else
  echo 'Not a branch to publish';
fi
