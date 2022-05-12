DEPS = ./public/src/cpp/processor-perf.cpp

OUTPUT_JS = ./public/src/js/worklet/CompiledProcessorModule.js

CC = emcc

EM_ES6_PATH = ./public/lib/em-es6-module.js

FLAGS = --bind -O1 \
	  -s WASM=1 \
		-s BINARYEN_ASYNC_COMPILATION=0 \
		-o $(OUTPUT_JS) $(DEPS) \
		--post-js $(EM_ES6_PATH)

build: $(DEPS)
	@$(CC) $(FLAGS)

clean:
	@rm -rf $(OUTPUT_JS)
