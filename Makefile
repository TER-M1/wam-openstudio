# FLAGS =  -lembind -o compiled_processor_perf.js processor-perf.cpp --post-js ./mod.js -s ENVIRONMENT="shell"
# CC = emcc


DEPS = ./src/cpp/processor-perf.cpp

OUTPUT_JS = ./src/js/compiled_processor_perf.js

CC = emcc

EM_ES6_PATH = ./lib/em-es6-module.js

FLAGS = --bind -O1 \
	  -s WASM=1 \
		-s BINARYEN_ASYNC_COMPILATION=0 \
		-s SINGLE_FILE=1 \
		-o $(OUTPUT_JS) $(DEPS) \
		--post-js $(EM_ES6_PATH)

build: $(DEPS)
	@$(CC) $(FLAGS)

clean:
	@rm -f ./src/js/compiled_processor_perf.js