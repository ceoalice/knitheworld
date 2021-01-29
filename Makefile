APP_HOME=/Users/khanning/AndroidStudioProjects/MyApplication

deploy:
	npm run build
	rm -r ${APP_HOME}/app/src/main/assets/www/*
	cp -r dist/* ${APP_HOME}/app/src/main/assets/www

relink:
	rm -r node_modules/scratch-vm
	rm -r node_modules/scratch-blocks
	ln -s ../../scratch-vm node_modules/
	ln -s ../../scratch-blocks node_modules/

.PHONY: deploy relink
