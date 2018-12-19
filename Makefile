include .env

default:
	echo no target

all: clean install mirror deploy

install:
	yarn
	rm -rf _install-grav
	composer create-project getgrav/grav _install-grav -vvv
	rm -rf _install-grav/user/pages
	rsync -r --ignore-existing _install-grav/ grav -v
	rm -rf _install-grav
	cd grav/user/themes/hayweed && yarn
	tree -L 4

clean:
	git clean -dxn
	rm -rvf grav/user/plugins/error
	rm -rvf grav/user/plugins/markdown-notices
	rm -rvf grav/user/plugins/problems
	rm -rvf grav/user/themes/quark
	tree -L 4

mirror:
	yarn mirror

deploy:
	rsync -e ssh --recursive --verbose  ${BUILD_PROD_DIR}/* ${DEPLOY_HOST}:${REMOTE_PROD_DIR}
